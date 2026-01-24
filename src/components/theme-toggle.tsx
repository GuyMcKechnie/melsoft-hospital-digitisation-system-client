import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            type="button"
            variant="outline"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
    );
}
