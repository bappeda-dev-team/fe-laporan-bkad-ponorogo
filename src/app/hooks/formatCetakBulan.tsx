import { OptionType } from "../../types"

export function namaBulan(bulan: OptionType | null): string {
    if (!bulan) return "";

    if (bulan.value > 12) {
        return bulan.label.toUpperCase();
    }

    return `BULAN ${(bulan.label ?? "").toUpperCase()}`;
}
