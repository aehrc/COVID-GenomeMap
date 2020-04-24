$(function() {
  $('#identicalTable').CSVToTable('../covid19data/duplicateIds.txt',{separator:"\t",headers: ['Name of the new combined sequences','Number of sequences merged','Names of the different strains merged']});
});
