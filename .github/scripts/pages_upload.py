#!/usr/bin/env python3
"""Deploy a static directory to Cloudflare Pages via the Direct Upload API.

Wrangler-free by design: wrangler and the cf CLI both fail with this
account's cfut_-prefixed API token (Cloudflare answers 9106/6111), while
plain API calls with the same token work fine. This script implements the
documented Direct Upload protocol directly:

  1. GET  /accounts/{acct}/pages/projects/{proj}/upload-token -> { jwt }
  2. POST /pages/assets/check-missing   { hashes }            -> missing
  3. POST /pages/assets/upload          KV-style JSON batches:
       [{ key, value (base64), base64: true, metadata: { contentType } }]
  4. POST /pages/assets/upsert-hashes   { hashes }
  5. POST /accounts/{acct}/pages/projects/{proj}/deployments (multipart)

Asset hash = blake3(base64(content) + extension) hex, first 32 chars --
identical to wrangler's @cloudflare/deploy-helpers hashFile.
Root-level _headers / _redirects / _routes.json are sent as form fields,
everything else goes into the manifest.
"""
import argparse
import base64
import json
import mimetypes
import os
import sys
import time

import requests
from blake3 import blake3

API = "https://api.cloudflare.com/client/v4"
SPECIAL_FIELDS = ("_headers", "_redirects", "_routes.json")
BATCH_FILES = 100
BATCH_BYTES = 25 * 1024 * 1024
EXTRA_MIME = {
    ".mjs": "application/javascript",
    ".wasm": "application/wasm",
    ".webmanifest": "application/manifest+json",
    ".avif": "image/avif",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
}


def content_type(rel):
    ext = os.path.splitext(rel)[1].lower()
    return EXTRA_MIME.get(ext) or mimetypes.guess_type(rel)[0] or "application/octet-stream"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--branch", required=True)
    ap.add_argument("--dir", required=True)
    args = ap.parse_args()

    token = os.environ["CLOUDFLARE_API_TOKEN"]
    account = os.environ["CLOUDFLARE_ACCOUNT_ID"]
    headers = {"Authorization": f"Bearer {token}"}
    session = requests.Session()

    manifest, contents, special = {}, {}, {}
    for dirpath, _, names in os.walk(args.dir):
        for name in names:
            full = os.path.join(dirpath, name)
            rel = "/" + os.path.relpath(full, args.dir).replace(os.sep, "/")
            if name in SPECIAL_FIELDS and os.path.dirname(rel) == "/":
                special[name] = open(full, "rb").read()
                continue
            data = open(full, "rb").read()
            ext = os.path.splitext(name)[1].lstrip(".")
            h = blake3((base64.b64encode(data).decode() + ext).encode()).hexdigest()[:32]
            manifest[rel] = h
            contents[h] = (rel, data)
    print(f"{len(manifest)} files, {len(special)} special files", flush=True)
    if len(manifest) > 20000:
        sys.exit("error: over the 20,000-file Pages limit")

    state = {"jwt": None, "fetched": 0.0}

    def jwt_headers():
        if state["jwt"] is None or time.time() - state["fetched"] > 1500:
            r = session.get(
                f"{API}/accounts/{account}/pages/projects/{args.project}/upload-token",
                headers=headers, timeout=60,
            )
            r.raise_for_status()
            state["jwt"] = r.json()["result"]["jwt"]
            state["fetched"] = time.time()
        return {"Authorization": f"Bearer {state['jwt']}"}

    def post_assets(path, payload, timeout=300):
        r = None
        for attempt in range(3):
            r = session.post(f"{API}/pages/assets/{path}", headers=jwt_headers(),
                             json=payload, timeout=timeout)
            if r.status_code == 401 and attempt == 0:
                state["jwt"] = None
                continue
            if r.status_code in (429, 500, 502, 503, 504) and attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            r.raise_for_status()
            return r.json()
        r.raise_for_status()

    hashes = list(contents)
    missing = []
    for i in range(0, len(hashes), 1000):
        res = post_assets("check-missing", {"hashes": hashes[i:i + 1000]}, timeout=120)
        missing.extend(res["result"])
    print(f"{len(missing)} of {len(hashes)} assets to upload", flush=True)

    done = 0
    batch, batch_bytes = [], 0

    def flush():
        nonlocal batch, batch_bytes, done
        if not batch:
            return
        post_assets("upload", batch)
        done += len(batch)
        print(f"uploaded {done}/{len(missing)}", flush=True)
        batch, batch_bytes = [], 0

    for h in missing:
        rel, data = contents[h]
        b64 = base64.b64encode(data).decode()
        batch.append({"key": h, "value": b64, "base64": True,
                      "metadata": {"contentType": content_type(rel)}})
        batch_bytes += len(b64)
        if len(batch) >= BATCH_FILES or batch_bytes >= BATCH_BYTES:
            flush()
    flush()

    post_assets("upsert-hashes", {"hashes": hashes}, timeout=120)

    form = {
        "manifest": (None, json.dumps(manifest)),
        "branch": (None, args.branch),
        "commit_dirty": (None, "false"),
        "pages_build_output_dir": (None, os.path.basename(os.path.normpath(args.dir))),
    }
    sha = os.environ.get("GITHUB_SHA")
    if sha:
        form["commit_hash"] = (None, sha)
        form["commit_message"] = (None, f"deploy {sha[:7]} via pages_upload.py")
    for name, data in special.items():
        form[name] = (name, data)
    r = session.post(
        f"{API}/accounts/{account}/pages/projects/{args.project}/deployments",
        headers=headers, files=form, timeout=300,
    )
    if not r.ok:
        print(r.text[:500])
        r.raise_for_status()
    dep = r.json()["result"]
    print(f"deployment {dep['id']} created: {dep['url']}")


if __name__ == "__main__":
    main()
