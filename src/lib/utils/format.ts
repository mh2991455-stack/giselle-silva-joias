/** Formata número como moeda BRL */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Gera URL de WhatsApp com mensagem encodada */
export function buildWhatsAppUrl(message: string, number = "5531997969787"): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Mensagem produto individual */
export function buildProductMessage(name: string, code: string, price: number): string {
  return `Olá Giselle! Tenho interesse no produto:\n\n✨ ${name}\n📋 Código: ${code}\n💰 ${formatPrice(price)}\n\nEstá disponível?`;
}

/** Mensagem lista de favoritos */
export function buildFavoritesMessage(
  items: Array<{ name: string; code: string; price: number }>
): string {
  const list = items
    .map((item, i) => `${i + 1}. ${item.name} (cód. ${item.code}) - ${formatPrice(item.price)}`)
    .join("\n");
  return `Olá Giselle! Vi essas peças no seu site e amei:\n\n${list}\n\nPode me passar mais informações? 💕`;
}

/** Mensagem orçamento */
export function buildBudgetMessage(
  items: Array<{ name: string; code: string; price: number; quantity: number }>
): string {
  const lines = items
    .map(
      (item) =>
        `- ${item.quantity}x ${item.name} (cód. ${item.code}) - ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return `Olá Giselle! Quero fazer um orçamento das seguintes peças:\n\n${lines}\n\nTotal estimado: ${formatPrice(total)}\n\nAguardo seu retorno!`;
}

/** Formata parcelas */
export function formatInstallments(price: number, count = 3): string {
  const installment = price / count;
  return `${count}x de ${formatPrice(installment)} sem juros`;
}
