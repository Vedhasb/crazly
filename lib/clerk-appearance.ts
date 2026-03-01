import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  variables: {
    // Colors
    colorPrimary: "#6366f1",
    colorBackground: "#0f0f0f",
    colorInputBackground: "rgba(255,255,255,0.04)",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.45)",
    colorNeutral: "#ffffff",
    colorDanger: "#f87171",
    colorSuccess: "#34d399",

    // Shape
    borderRadius: "0.875rem",

    // Font
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: "14px",
  },
  elements: {
    // Outer card
    card: {
      background: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)",
      borderRadius: "1.25rem",
      padding: "2rem",
    },

    // Header
    headerTitle: {
      color: "#ffffff",
      fontSize: "1.25rem",
      fontWeight: "700",
      letterSpacing: "-0.02em",
    },
    headerSubtitle: {
      color: "rgba(255,255,255,0.4)",
      fontSize: "0.875rem",
    },

    // Logo area — show Crazly branding
    logoBox: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "0.5rem",
    },

    // Social buttons (Google etc)
    socialButtonsBlockButton: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#ffffff",
      borderRadius: "0.875rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      padding: "0.75rem 1rem",
      transition: "all 0.2s ease",
      "&:hover": {
        background: "rgba(255,255,255,0.08)",
        borderColor: "rgba(99,102,241,0.4)",
      },
    },
    socialButtonsBlockButtonText: {
      color: "#ffffff",
      fontWeight: "500",
    },

    // Divider
    dividerLine: {
      background: "rgba(255,255,255,0.08)",
    },
    dividerText: {
      color: "rgba(255,255,255,0.25)",
      fontSize: "0.75rem",
    },

    // Form fields
    formFieldLabel: {
      color: "rgba(255,255,255,0.6)",
      fontSize: "0.8rem",
      fontWeight: "500",
      marginBottom: "0.4rem",
    },
    formFieldInput: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "0.875rem",
      color: "#ffffff",
      fontSize: "0.875rem",
      padding: "0.75rem 1rem",
      outline: "none",
      transition: "border-color 0.2s ease",
      "&:focus": {
        borderColor: "rgba(99,102,241,0.5)",
        background: "rgba(99,102,241,0.04)",
      },
      "&::placeholder": {
        color: "rgba(255,255,255,0.2)",
      },
    },

    // Primary button
    formButtonPrimary: {
      background: "linear-gradient(135deg, #6366f1, #818cf8)",
      border: "none",
      borderRadius: "0.875rem",
      color: "#ffffff",
      fontSize: "0.875rem",
      fontWeight: "600",
      padding: "0.75rem 1.5rem",
      boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
      transition: "all 0.2s ease",
      "&:hover": {
        opacity: "0.9",
        transform: "scale(1.01)",
      },
      "&:active": {
        transform: "scale(0.98)",
      },
    },

    // Footer links
    footerActionLink: {
      color: "#818cf8",
      fontWeight: "500",
      "&:hover": {
        color: "#a5b4fc",
      },
    },
    footerActionText: {
      color: "rgba(255,255,255,0.3)",
      fontSize: "0.8rem",
    },

    // Form error
    formFieldErrorText: {
      color: "#f87171",
      fontSize: "0.75rem",
    },

    // Identity preview (after OAuth)
    identityPreviewText: {
      color: "rgba(255,255,255,0.7)",
    },
    identityPreviewEditButton: {
      color: "#818cf8",
    },

    // OTP input
    otpCodeFieldInput: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#ffffff",
      borderRadius: "0.75rem",
      "&:focus": {
        borderColor: "rgba(99,102,241,0.5)",
      },
    },

    // Alert boxes
    alertText: {
      color: "rgba(255,255,255,0.7)",
      fontSize: "0.8rem",
    },

    // Back button
    backLink: {
      color: "rgba(255,255,255,0.4)",
      "&:hover": {
        color: "#ffffff",
      },
    },
  },

  layout: {
    socialButtonsPlacement: "top",
    showOptionalFields: false,
    logoPlacement: "inside",
  },
};