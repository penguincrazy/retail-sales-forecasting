# Project file inventory

This repository is organised as a static research portal plus a compact set of reproducibility artifacts.

| Path | Purpose |
|---|---|
| index.html | Research overview: question, data, preprocessing, methods, evaluation, results, limitations and reproduction |
| studio/index.html | Data Studio: full-holdout family metrics, model validation summary, feature ablation and sampled row inspection |
| predictor/index.html | Forecast Explorer: inspection of saved LightGBM holdout prediction records; not live inference |
| qna/index.html | Oral-defense question bank based on the course-project notebook |
| portal.css | Shared layout and visual system for all portal pages |
| portal.js | Navigation and data-driven interactions |
| data/results.json | Model metrics, validation summaries, family metrics and ablation summaries used by the site |
| data/prediction_inspector.json | Four-point-per-family preview drawn from the notebook's 5,000-row holdout sample |
| outputs/ | Exported experiment metadata and compact CSV result tables |
| docs/methodology.md | Forecast information boundary, feature groups, models and validation protocol |
| docs/limitations.md | Known limitations and interpretation boundaries |
| requirements.txt | Python dependencies used by the notebook |
| .gitignore | Excludes local Kaggle data, caches and generated working directories |

## Deliberately not committed

- Raw Kaggle CSVs and the local competition archive: download separately under Kaggle's competition terms.
- Trained model binaries: the current course notebook does not save a serialized model artifact, and the static website does not run live inference.
- The alternative per-family LightGBM script and four-model LightGBM ensemble notebook: these represent different experimental pipelines and are not the source of the reported course-project metrics.
- The unrelated Indonesian individual-assignment notebook: it is not part of this team project.

The canonical source for the reported course experiment is the report-style ES 335 retail-sales notebook. The results in outputs/ and data/results.json should be checked against that notebook.
