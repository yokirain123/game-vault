export function isValidHttpUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function focusFormControl(form: HTMLFormElement, name: string) {
  const control = form.elements.namedItem(name);

  if (control instanceof HTMLElement) {
    control.focus();
  }
}
