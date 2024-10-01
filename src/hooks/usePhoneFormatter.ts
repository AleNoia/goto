const usePhoneFormatter = (input: number) => {
  const cleaned = input.toString().replace(/\D/g, '');

  // Adiciona o formato desejado
  if (cleaned.length > 10) {
    const ddd = cleaned.slice(0, 2);
    const prefix = cleaned.slice(2, 7);
    const suffix = cleaned.slice(7, 11);
    return `(${ddd}) ${prefix}-${suffix}`;
  } else if (cleaned.length > 6) {
    const ddd = cleaned.slice(0, 2);
    const prefix = cleaned.slice(2, 7);
    const suffix = cleaned.slice(7);
    return `(${ddd}) ${prefix}-${suffix}`;
  } else if (cleaned.length > 2) {
    const ddd = cleaned.slice(0, 2);
    const prefix = cleaned.slice(2);
    return `(${ddd}) ${prefix}`;
  } else if (cleaned.length > 0) {
    return `(${cleaned}`;
  }
  return '';
};

export default usePhoneFormatter;
