import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
import { z } from "zod";

const schema = z.object({
  firstname: z.string().min(1, "First name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Must be 8+ chars"),
});

// ─── Shared field style (dark input) ────────────────────────────────────────
// Using style instead of className for colors so Tailwind JIT purging
// doesn't strip them (arbitrary values in prop strings aren't scanned).
const darkInputStyle: React.CSSProperties = {
  backgroundColor: "#12141c",
  border: "1px solid #252836",
  color: "#ffffff",
  borderRadius: "12px",
};

const fieldLabel = "text-[#d1d5db] text-sm font-medium";
const fieldRequired = "text-[#ef4444]";
const fieldError = "text-[#ef4444] text-xs mt-1 block";

export function HeroFormDemo() {
  return (
    // Page background — use style for guaranteed dark color
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#080a0f" }}
    >
      <div className="w-full max-w-sm">
        {/* Card wrapper — use style for card background color */}
        <div
          className="rounded-2xl p-6 shadow-2xl border overflow-visible"
          style={{ backgroundColor: "#0f1117", borderColor: "#1e2230" }}
        >
          <Formbox
            open={true}
            onOpenChange={() => {}}
            mode="inline"
            closeFormIcon={false}

            // Error shown top-right of the label row (matches the screenshot)
            errorPosition="top"

            // No container card from Formbox — we wrap manually above for full color control
            containerClassName="w-full overflow-visible"
            innerContainerClassName="space-y-4 overflow-visible"

            // Button row: no top border, full width
            buttonContainerClassName="pt-2 flex w-full"

            // Input layout base (colors via per-field style below)
            inputClassName="rounded-xl border w-full"

            // ── Title & Description ────────────────────────────────────────
            title={{
              text: "Create an account",
              className: "text-2xl font-bold text-white mb-1",
            }}
            description={{
              text: "Enter your details to test the form live.",
              className: "text-sm mb-5",
              // gray color via Tailwind (text-gray-400 is safe — it's not arbitrary)
            }}

            // ── Form-level label defaults (overridden per-field below) ─────
            labelClassName="block text-sm font-medium text-gray-300 mb-1.5"
            requiredClassName="text-red-500 ml-0.5"
            errorClassName="text-red-400 text-xs font-medium"

            // ── Zod Schema ─────────────────────────────────────────────────
            schema={schema}

            // ── Submit Handler ─────────────────────────────────────────────
            onSubmit={async (data) => {
              console.log("Form submitted:", data);
              await new Promise((r) => setTimeout(r, 1500));
            }}

            // ── Toast ──────────────────────────────────────────────────────
            toast={{
              loading: "Creating account...",
              success: "Account created successfully! 🎉",
              error: "Something went wrong",
              position: "bottom-right",
              duration: 3000,
            }}

            // ── Fields ─────────────────────────────────────────────────────
            fields={[
              {
                name: "firstname",
                type: "text",
                label: "First Name",
                placeholder: "Sarah",
                required: true,
                style: darkInputStyle,
                labelClassName: fieldLabel,
                requiredClassName: fieldRequired,
                errorClassName: fieldError,
              },
              {
                name: "email",
                type: "email",
                label: "Email",
                placeholder: "sarah@design.dev",
                required: true,
                style: darkInputStyle,
                labelClassName: fieldLabel,
                requiredClassName: fieldRequired,
                errorClassName: fieldError,
              },
              {
                name: "password",
                type: "password",
                label: "Password",
                placeholder: "Must be 8+ chars",
                required: true,
                passwordToggle: true,
                style: darkInputStyle,
                labelClassName: fieldLabel,
                requiredClassName: fieldRequired,
                errorClassName: fieldError,
                // Eye icon color
                passwordToggleClassName:
                  "text-gray-500 hover:text-white transition-colors",
              },
            ]}

            // ── Button ─────────────────────────────────────────────────────
            buttons={[
              {
                name: "Create Account",
                type: "submit",
                loadingText: "Creating...",
                // Layout via className (standard Tailwind — always safe)
                className:
                  "w-full rounded-xl py-3 font-semibold text-base cursor-pointer transition-opacity hover:opacity-90",
                // Colors via style (bypasses Tailwind purging entirely)
                style: {
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  border: "none",
                },
                disabledClassName: "opacity-50 cursor-not-allowed",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default HeroFormDemo;
