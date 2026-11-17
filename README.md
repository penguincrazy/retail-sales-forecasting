# Retail Sales Forecasting — ES 335 Project Website

A static interactive website for the ES 335 daily retail-sales forecasting and feature-analysis project. It is built with HTML, CSS, and vanilla JavaScript and is intended for GitHub Pages.

**Project team:** Krishn Kumar and Arush Banerjee.

## Website files
- `index.html` — project narrative and page structure
- `style.css` — responsive visual design
- `script.js` — interactive charts, family explorer, and navigation
- `data/results.json` — exported model metrics, 33 family-level result records, feature-ablation results, and a compact 50-point preview sampled from the exported 5,000-row prediction sample
- `.nojekyll` — prevents Jekyll processing

## Run locally
The page loads `data/results.json` with `fetch`, so serve the directory with a local web server rather than opening `index.html` directly:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Enable GitHub Pages
Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/(root)` and save. The expected site URL is:

https://penguincrazy.github.io/retail-sales-forecasting/

GitHub may take a little time to publish after the source is saved.

## Methodology summary
The project forecasts daily sales for each store–product-family pair over a 16-day horizon. It compares a seasonal-naive baseline with OLS, Ridge, Lasso, Decision Tree, Random Forest, KNN, and LightGBM. Evaluation uses three rolling-origin folds and a separate final holdout. Model fitting was capped at 80,000 training rows for the relevant estimators; the results therefore describe that capped-training setup. Future actual sales are not used as predictors, and the forecast assumes promotion values are known over the 16-day horizon.

## Result-data caveats
- The compact scatter plot is a 50-point preview from a fixed-stride selection of the exported 5,000-row prediction sample; it is not a full holdout visualization.
- The exported archive did not contain `worst_store_family_errors.csv`, so the site does not claim to display a full store-family error ranking.
- The reported metrics are the exported results from the executed notebook. The team should cross-check all values against the notebook before submission.

## AI assistance disclosure
AI assistance was used for website planning, implementation support, and editing. The project team is responsible for independently verifying the displayed results and being able to explain the methodology, code, and conclusions.
