# Methodology and experiment protocol

## Problem definition

The target is daily sales for one store × product-family × date. The project uses the Kaggle Store Sales – Time Series Forecasting data and evaluates a fixed 16-day forecast horizon.

## Information boundary

At a forecast origin, actual sales inside the next 16 days are unavailable. Sales lags therefore begin at 16 days, and rolling means / standard deviations are shifted by 16 days before they are calculated. Calendar variables are treated as known in advance. Test-period promotion values are assumed to be available at the forecast origin. Future actual sales, future oil prices and future transaction counts are not used as predictors.

## Preprocessing and features

The target is transformed with log1p(sales); predictions are converted back with expm1 and clipped to non-negative values before scoring. Numerical values are median-imputed. Scale-sensitive estimators use standardisation. Categorical columns use most-frequent imputation and one-hot encoding. All preprocessing is fitted on the training side of each validation split.

Features include calendar / cyclical encodings, promotion counts, national / regional / local holiday indicators, store and family context, sales lags from 16 to 373 days, and shifted rolling summaries.

## Models and baseline

The Seasonal naive (Base model) selects the latest matching weekday strictly before the forecast origin. For lead day h, the source date is target_date − 7 × ceil(h / 7) days. If that store–family–date is absent, it uses the median sales for that store–family from history available at the forecast origin; zero is only the final fallback if the median is also unavailable.

Compared models: OLS, Ridge, Lasso, Decision Tree, Random Forest, KNN and LightGBM, plus Seasonal naive (Base model).

The LightGBM configuration uses a regression objective on log1p(sales), 600 estimators, learning_rate=0.04, num_leaves=31, min_child_samples=30, colsample_bytree=0.8 and reg_lambda=1.0. A GPU capability probe chooses GPU with max_bin=63 or CPU with max_bin=255. The fixed settings are a practical comparison configuration rather than an exhaustively tuned optimum. Although subsample=0.8 appears in the constructor, subsample_freq=0 disables row bagging in this run; colsample_bytree remains active.

## Validation and selection

Three rolling-origin development folds each contain a 16-day validation window:

- 13–28 June 2017
- 29 June–14 July 2017
- 15–30 July 2017

The final internal holdout is 31 July–15 August 2017. Candidate selection is based on mean rolling RMSLE; final holdout values are reported separately.

## Compute cap

Model fitting is capped at 80,000 sampled training rows where required, using a deterministic seed of 42. Validation and holdout rows are evaluated in full. Results therefore describe this capped-training configuration.

## Metrics

RMSLE is computed from log1p(actual) and log1p(predicted). MAE is calculated on the sales scale. They are complementary: RMSLE emphasises relative/log-scale deviations, while MAE is in sales units. In rolling validation, LightGBM has mean RMSLE 0.41407 (SD 0.00659) and mean MAE 81.00; the Seasonal naive (Base model) has mean RMSLE 0.52076 and mean MAE 74.46. Therefore, LightGBM wins on the selection metric RMSLE, but not on rolling MAE. On the separate final holdout, LightGBM has RMSLE 0.45270 and MAE 85.77; the base model has RMSLE 0.61704 and MAE 96.54.


## Model-selection interpretation

The Seasonal naive (Base model) is a meaningful weekly-pattern reference: for each forecast day it uses the latest matching weekday available at the forecast origin, with a store-family historical-median fallback when that lookup is absent. Candidate models are compared on the same folds. LightGBM is selected by mean rolling RMSLE, not by every metric: the base model has lower mean rolling MAE in the three development folds. Candidate hyperparameters were fixed for this comparison rather than selected through an exhaustive search, so conclusions apply to the tested configurations.

## Forecast-horizon analysis

The updated notebook reuses predictions from the three rolling-origin folds to calculate RMSLE and MAE separately for forecast days 1–16. The summary reports the mean and standard deviation of fold-level metrics for each lead time. This describes how errors vary with horizon under the tested folds; it is not a calibrated prediction interval.
