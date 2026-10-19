import { createTheme } from "@mui/material/styles";

const small = { defaultProps: { size: "small" } } as const;

export const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAutocomplete: small,
    MuiButton: small,
    MuiButtonGroup: small,
    MuiCheckbox: small,
    MuiChip: small,
    MuiFab: small,
    MuiFilledInput: small,
    MuiFormControl: small,
    MuiIconButton: small,
    MuiInputBase: small,
    MuiInputLabel: small,
    MuiOutlinedInput: small,
    MuiPagination: small,
    MuiRadio: small,
    MuiRating: small,
    MuiSlider: small,
    MuiSwitch: small,
    MuiTable: small,
    MuiTextField: small,
    MuiToggleButton: small,
    MuiToggleButtonGroup: small,
  },
});
