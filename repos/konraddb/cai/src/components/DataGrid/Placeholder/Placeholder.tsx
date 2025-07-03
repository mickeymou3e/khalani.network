import React from "react";

import Brightness5OutlinedIcon from "@mui/icons-material/Brightness5Outlined";
import { Box, TableBody, TableCell, TableRow, Typography } from "@mui/material";

import { iconStyles } from "@/styles/others/muiIconStyles";

import { ColumnProps } from "../types";
import { contentStyle, emptyBodyStyle } from "./Placeholder.styles";
import Growth from "@/icons/Growth";
import { Button } from "@/components/Button";

type PlaceholderProps = {
  columns: ColumnProps[];
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
  children?: React.ReactNode;
  searchKeyword?: string;
  showPlaceholderButton?: boolean;
};

type EmptyGridMessageProps = {
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
};

const EmptyGridMessage = ({
  placeholder,
  placeholderIcon,
}: EmptyGridMessageProps) => (
  <>
    {placeholderIcon ?? <Brightness5OutlinedIcon sx={iconStyles()} />}
    {placeholder && (
      <Typography variant="body2" color="primary.gray2">
        {placeholder}
      </Typography>
    )}
  </>
);

export const NoResultsFoundMessage = ({
  placeholderIcon,
}: {
  placeholderIcon?: React.ReactNode;
}) => {
  return (
    <>
      {placeholderIcon ?? <Growth />}
      <Typography variant="body2" color="primary.gray2">
        No results found
      </Typography>
    </>
  );
};

const PlaceHolder = ({
  columns,
  placeholder,
  placeholderIcon,
  children = null,
  searchKeyword,
  showPlaceholderButton,
}: PlaceholderProps) => (
  <TableBody>
    <TableRow>
      <TableCell sx={emptyBodyStyle} colSpan={columns.length}>
        <Box sx={contentStyle}>
          {children ||
            (searchKeyword ? (
              <NoResultsFoundMessage />
            ) : (
              <>
                <EmptyGridMessage
                  placeholder={placeholder}
                  placeholderIcon={placeholderIcon}
                />
                {showPlaceholderButton && (
                  <Button variant="contained" sx={{ mt: 2 }}>
                    Upload
                  </Button>
                )}
              </>
            ))}
        </Box>
      </TableCell>
    </TableRow>
  </TableBody>
);

export default PlaceHolder;
