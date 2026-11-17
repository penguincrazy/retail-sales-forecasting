# Limitations and interpretation boundaries

- The experiment covers one retailer and one historical time period; results may not generalise to other retailers or future demand regimes.
- The fixed 16-day horizon limits how recently observed target values can enter lag features.
- Promotion values are assumed to be known for the full forecast horizon. A deployment with revised or unplanned promotions may perform differently.
- Model fitting is capped at 80,000 rows where needed. Full-data retraining could change performance and model rankings.
- Family-level and aggregate metrics do not identify the cause of an error. Feature ablation is predictive evidence, not causal inference.
- The row-level prediction explorer uses a small preview selected from a 5,000-row holdout prediction sample. It is not the full 28,512-row holdout.
- The static website inspects saved LightGBM predictions. It does not contain a serialized LightGBM model or provide new live inference.
- The notebook's statistical summaries do not include formal significance tests. Fold standard deviations are descriptive.

- Forecast-horizon metrics describe three rolling validation folds and are not calibrated uncertainty intervals or guarantees for future dates.
- Candidate hyperparameters were fixed for the model comparison rather than selected through an exhaustive search; conclusions apply to the tested configurations.
