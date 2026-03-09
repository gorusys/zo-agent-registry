# Publishing these docs on GitHub Pages

1. **Enable GitHub Pages**
   - Repo → **Settings** → **Pages**
   - Under **Build and deployment** → **Source**: choose **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/docs`
   - Save

2. **URL**
   - Project site: `https://<username>.github.io/<repo>/`
   - Example: `https://gorusys.github.io/zo-agent-registry/`

3. **Local preview (optional)**
   - Install Ruby and Jekyll, then run in repo root:
   - `cd docs && bundle exec jekyll serve`
   - Or use Docker: `docker run -v $(pwd)/docs:/srv/jekyll -p 4000:4000 jekyll/jekyll jekyll serve`

These docs are built by GitHub with Jekyll (see `_config.yml` and `index.md`).
