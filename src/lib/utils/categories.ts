export function matchesCategory(productCategory: string, filter: string): boolean {
  if (!filter || filter === "Todos") return true;
  const c = productCategory;
  switch (filter) {
    case "Anéis":        return c === "Anel" || c === "Aliança";
    case "Brincos":      return c === "Brinco" || c === "Trio Brinco";
    case "Argolas":      return c === "Argola" || c === "Trio Argola";
    case "Colares":      return c.startsWith("Colar");
    case "Chokers":      return c === "Choker";
    case "Correntes":    return c.startsWith("Corrente");
    case "Pulseiras":    return c.startsWith("Pulseira");
    case "Braceletes":   return c === "Bracelete";
    case "Pingentes":    return c === "Pingente";
    case "Escapulários": return c === "Escapulário";
    case "Conjuntos":    return c === "Conjunto";
    case "Trios":        return c.startsWith("Trio");
    case "Piercings":    return c.includes("Piercing");
    case "Infantil":     return c.includes("Infantil") || c.includes("Menino") || c.includes("Menina");
    case "Masculino":    return c.includes("Masculin");
    case "Cuidados":     return c === "Cuidados";
    default:             return c.toLowerCase().includes(filter.toLowerCase());
  }
}
