const getFile = (filename) => {
  let files;
  try {
    files = localStorage.getItem("files");
    files = JSON.parse(files);

    return files[filename];
  } catch (error) {
    console.log("Couldn't access file!");
  }
};

const getAllFiles = () => {
  let files;
  try {
    files = localStorage.getItem("files");
    files = JSON.parse(files);
    return files;
  } catch (error) {
    console.log("Couldn't access file!");
  }
};

const saveFile = (filename, text) => {
  const files = getAllFiles() || {};
  files[filename] = text;

  const filesStr = JSON.stringify(files);

  localStorage.setItem("files", filesStr);

  if (window.renderFiles) {
    window.renderFiles();
  }
};

const deleteFile = (filename) => {
  localStorage.removeItem(filename);
};

const renameFile = (newName, currentName) => {
  const fileText = localStorage.getItem(currentName);
  localStorage.removeItem(currentName);
  localStorage.setItem(newName, fileText);
};
