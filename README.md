# Retail Sales Forecasting and Feature Analysis — ES 335

**Project team:** Krishn Kumar and Arush Banerjee  
**Dataset:** Kaggle Store Sales – Time Series Forecasting (Corporación Favorita)  
**Forecast unit:** Daily store × product family × date  
**Forecast horizon:** 16 days

## Live research portal

- **Website:** https://penguincrazy.github.io/retail-sales-forecasting/
- **Source repository:** https://github.com/penguincrazy/retail-sales-forecasting

The static portal has four pages:

| Page | Purpose |
|---|---|
| Overview | Research question, data, preprocessing, baseline, candidate models, evaluation, results, error analysis, limitations and reproduction |
| Data Studio | Panel-coverage diagnostics, full-holdout family-level error comparison, searchable ranking of all 1,782 store-family errors with CSV download, model validation summary, ablation results, and a clearly labelled sample-row inspector |
| Forecast Explorer | Inspects saved LightGBM holdout predictions; it does not run a new model inference |
| Oral Defense | Individual defense preparation mapped to contribution, key choices, evaluation, a limitation and a small change |

## Main findings

LightGBM is the best model by mean rolling-validation RMSLE and final-holdout RMSLE.

| Evaluation | LightGBM | Random Forest | Seasonal naive (Base model) |
|---|---:|---:|---:|
| Mean rolling RMSLE | 0.41407 | 0.42933 | 0.52076 |
| Final holdout RMSLE | 0.45270 | 0.51365 | 0.61704 |
| Final holdout MAE | 85.77 | 94.08 | 96.54 |

The final holdout is 31 July–15 August 2017. The three rolling validation windows are 13–28 June, 29 June–14 July, and 15–30 July 2017.

Removing sales-history features increases mean rolling RMSLE from 0.41428 to 0.58348, the largest degradation among the tested feature-group ablations.

## Repository structure

- index.html, studio/, predictor/, qna/ — four static research-portal pages
- portal.css, portal.js — shared layout and interactive behaviours
- data/results.json — model metrics, rolling validation, family errors and feature ablation
- data/prediction_inspector.json — four-point-per-family preview from the exported 5,000-row holdout sample
- outputs/ — compact CSV results, experiment metadata, and the complete 1,782-row `worst_store_family_errors.csv` ranking
- notebooks/ES335_Retail_Sales_Forecasting_Project.ipynb — canonical corrected course-project notebook source
- docs/methodology.md — experimental protocol and feature engineering
- docs/limitations.md — assumptions and limitations
- PROJECT_FILE_INVENTORY.md — repository inventory
- requirements.txt — Python notebook dependencies

## Reproduce the experiment

1. Download the competition files from Kaggle Store Sales – Time Series Forecasting.
2. Open the canonical [project notebook in this repository](notebooks/ES335_Retail_Sales_Forecasting_Project.ipynb), or the tested [Kaggle copy](https://www.kaggle.com/code/krishn9656/notebook3b38d5a9f8). The canonical notebook is archived at [`notebooks/ES335_Retail_Sales_Forecasting_Project.ipynb`](notebooks/ES335_Retail_Sales_Forecasting_Project.ipynb). The tested Kaggle copy is also available at [the team workspace](https://www.kaggle.com/code/krishn9656/notebook3b38d5a9f8).
3. Attach the dataset and run the notebook from the first cell.
4. The notebook exports rolling validation, final holdout, family error, feature-ablation, prediction-sample, forecast-horizon and environment-version files to project_outputs/.
5. Compare the exported metrics with the compact CSV artifacts in outputs/.

Install the Python dependencies with:

    pip install -r requirements.txt

To run the website locally, serve the repository root rather than opening the HTML file directly:

    python -m http.server 8000

Then open http://localhost:8000.

## Forecast information boundary

Sales-history features are shifted by 16 days. Calendar features are known in advance. Promotion values are assumed to be known for the entire forecast window. Future actual sales, future oil prices and future transaction values are not used. Numerical and categorical preprocessing is fitted on the training side of each validation split.

Model fitting is capped at 80,000 sampled training rows where required, using seed 42. Validation and holdout rows are evaluated in full. Scores describe this capped-training setup.

## Interpretation boundaries

- Family-level error metrics use all 864 holdout rows per family; the row-level portal preview is only a small sample.
- The prediction inspector is not a live predictor. No serialized LightGBM model or inference service is included in this static website repository.
- Feature ablation assesses predictive usefulness, not causal effects.
- Formal significance tests were not part of this experiment.
- Raw competition data is not committed; download it from Kaggle under the competition's data terms.

## AI-use disclosure

AI assistance was used for parts of website planning, implementation and editing. The project team is responsible for independently verifying all displayed results against the executed notebook and explaining the modeling decisions and conclusions.


## Forecast-horizon error analysis

The updated notebook derives day-ahead RMSLE and MAE for each of the 16 forecast positions from the three rolling-origin validation folds. It compares the CV-selected model with Seasonal naive (Base model), and exports fold-level and three-fold summary CSVs. These values must be regenerated by running the updated notebook; horizon-specific scores are not hard-coded before that run.

## Environment reproducibility

The notebook records the Python, NumPy, pandas, Matplotlib, scikit-learn, LightGBM and Jupyter versions detected in the execution environment to project_outputs/environment.json and experiment_metadata.json. The repository requirements file specifies minimum supported versions; the generated environment file is the exact runtime snapshot.

## Interpretation note

LightGBM has lower mean rolling-validation RMSLE, but Seasonal naive (Base model) has lower mean rolling-validation MAE. On the final holdout, LightGBM improves on the base model on both RMSLE and MAE. The preferred model therefore depends on the chosen metric and evaluation period.
