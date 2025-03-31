import path from "path";

export function getFilePath(file) {
    const filePath = file.path;

    // Normalizar la ruta para que sea compatible con Windows y MacOS
    const normalizedPath = path.normalize(filePath);

    // Convertir a un formato de ruta compatible con todos los sistemas
    const fileSplit = normalizedPath.split(path.sep);

    return `${fileSplit[fileSplit.length - 2]}/${fileSplit[fileSplit.length - 1]}`;
}
