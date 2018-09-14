window.addEventListener('dragover',function(e)
{
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

window.addEventListener('drop', function(e)
{
  e.preventDefault();
  e.stopPropagation();

  let file = e.dataTransfer.files[0];
  let name = file.path ? file.path : file.name;

  if(!name || name.indexOf(".pico") < 0){ console.log("Pico","Not a pico file"); return; }

  let reader = new FileReader();
  reader.onload = function(e){
    pico.load(e.target.result.toString().trim());
  };
  reader.readAsText(file);
});