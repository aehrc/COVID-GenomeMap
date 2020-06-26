
## Workflow
The pipeline works through the following steps:

- Filters all input sequences by N content (%N <1 and no more than 50N's in a row)
- Align all sequences using MAFFT
- Trim the alignment ends based on coverage (>95% coverage of an alignment position required to retain)
- Collapse identical sequences after trimming
- Calculate mutation frequency across the trimmed genome
- Construct a reference sequence based on multi-alignment
- Perform k-mer signature analysis
- Construct phylogenetic trees

## [COVID-19 Genomics Website](https://covid19genomes.csiro.au/)
