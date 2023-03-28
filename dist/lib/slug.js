// Default options
const defaultSlugifyOptions = {
    alphanumeric: true,
    lowercase: true,
    separator: "-",
    replace: {
        "Ð": "D",
        "ð": "d",
        "Đ": "D",
        "đ": "d",
        "ø": "o",
        "ß": "ss",
        "æ": "ae",
        "œ": "oe",
    },
};
export function slugifier(options = defaultSlugifyOptions) {
    const { lowercase, alphanumeric, separator, replace } = options;
    return function (text) {
        if (lowercase)
            text = text.toLowerCase();
        text = text.replaceAll(/[^a-z\d.-]/giu, (char) => {
            if (char in replace)
                return replace[char];
            if (alphanumeric) {
                char = char.normalize("NFKD").replaceAll(/[\u0300-\u036F]/g, "");
            }
            char = /[\p{L}\u0300-\u036F]/u.test(char) ? char : "-";
            return alphanumeric && /[^\w-]/.test(char) ? "" : char;
        });
        if (lowercase)
            text = text.toLowerCase();
        return text
            .replaceAll(/(?<=^|[/.])-+(?=[^.-])|(?<=[^.-])-+(?=$|[.])/g, "")
            .replaceAll(/-+/g, separator);
    };
}
//# sourceMappingURL=slug.js.map