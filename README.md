# Retail Sales Forecasting — ES 335 Project Website

This is a static website built with HTML, CSS, and vanilla JavaScript. It is designed for GitHub Pages and does not require a backend.

**Project team:** Krishn Kumar and Arush Banerjee.

## Files
- `index.html` — page content and structure
- `style.css` — responsive design
- `script.js` — charts, family explorer, and navigation
- `data/results.json` — exported metrics and the 5,000-row prediction sample

## Run locally
Because the page fetches `data/results.json`, open it through a local web server rather than double-clicking `index.html`.

With Python installed, run this command from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages
1. Create a GitHub repository (for example, `retail-sales-forecasting`).
2. Upload the contents of this folder to the repository root. Do not upload the parent folder as an extra nested directory.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Wait for GitHub Pages to publish and open the URL shown in the Pages settings.

## Important verification before submission
- Add the final notebook/source-code link once the repository is ready.
- Confirm team-member names and any required course details.
- The current data archive did not include `worst_store_family_errors.csv`; this page therefore does not claim to show a full store-family error ranking.
- `holdout_prediction_sample.csv` contains 5,000 rows. Its scatter plot is labelled as a sample and must not be interpreted as the full holdout distribution.
- The page reports the metrics exactly as supplied in the exported CSV files.
- The feature-ablation chart averages the three fold-level results from `feature_ablation_results.csv`.

## AI assistance disclosure
AI assistance was used to help implement and edit the website. The project team should review the source, verify all reported figures against the notebook, and be prepared to explain the methodology and conclusions.
