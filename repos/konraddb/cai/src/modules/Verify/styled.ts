import { Theme } from '@mui/material';
import { CSSProperties } from 'react';

export const sidebarContainerStyles = (theme: Theme) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100vh',
  width: '586px',
  backgroundColor: '#fff',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
  gap: '1rem',
});

export const verifyHeaderStyles: CSSProperties = {
  width: '586px',
  height: '48px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '32px',
  fontWeight: 600,
  lineHeight: '48px',
  textAlign: 'center',
  color: '#16131C',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.5rem',
};

export const subtitleStyles: CSSProperties = {
  width: '586px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '28px',
  textAlign: 'center',
  color: '#6A677E',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
};

export const inputLabelStyles: CSSProperties = {
  fontSize: '0.875rem',
  color: '#666',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
};

export const inputBaseStyles: CSSProperties = {
  width: '100%',
  padding: '0.8rem 1rem',
  border: '1px solid #ddd',
  borderRadius: '16px',
  fontSize: '1rem',
  backgroundColor: '#f9f9f9',
  marginBottom: '1rem',
};

export const verifyButtonStyles: CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  fontWeight: 600,
  fontSize: '1rem',
  marginTop: '2rem',
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '24px',
  textTransform: 'none',
};

export const cancelButtonStyles: CSSProperties = {
  marginTop: '1rem',
  textTransform: 'none',
  color: '#888',
  fontSize: '0.9rem',
};

export const paginationContainerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '131px',
  height: '32px',
  borderRadius: '16px',
  backgroundColor: '#FFFFF',
  gap: '8px',
};

export const arrowButtonStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
};

export const pageNumberStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#efefef',
  color: '#333',
  fontSize: '14px',
  fontWeight: 500,
  textAlign: 'center',
};

export const circleStyle = (color: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: '0.5rem',
  marginBottom: '0.5rem',
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: '18px',
});
