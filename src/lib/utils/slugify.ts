/** Gera slug kebab-case sem acentos a partir de uma string */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
    .trim()
    .replace(/\s+/g, "-") // espaços → hífens
    .replace(/-+/g, "-"); // hífens duplos → simples
}

/** Gera slug de produto: name + code */
export function generateProductSlug(name: string, code: string): string {
  return generateSlug(`${name} ${code}`);
}
