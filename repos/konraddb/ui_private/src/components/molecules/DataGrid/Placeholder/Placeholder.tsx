import { useTranslation } from "next-i18next";

import { Box, TableBody, TableCell, TableRow, Typography } from "@mui/material";

import { EmptyGrid } from "@/components/atoms";
import { Growth } from "@/components/atoms/CustomIcons";

import { ColumnProps } from "../types";
import { contentStyle, emptyBodyStyle } from "./Placeholder.styles";

type PlaceholderProps = {
  columns: ColumnProps[];
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
  children?: React.ReactNode;
  searchKeyword?: string;
};

type EmptyGridMessageProps = {
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
};

const namespace = "common:components:datagrid";

const EmptyGridMessage = ({
  placeholder,
  placeholderIcon,
}: EmptyGridMessageProps) => (
  <>
    {placeholderIcon ?? <EmptyGrid />}
    {placeholder && (
      <Typography variant="body2" color="primary.gray2">
        {placeholder}
      </Typography>
    )}
  </>
);

const NoResultsFoundMessage = () => {
  const { t } = useTranslation(namespace);
  return (
    <>
      <Growth />
      <Typography variant="body2" color="primary.gray2">
        {t(`${namespace}:noResultsFound`)}
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
}: PlaceholderProps) => (
  <TableBody>
    <TableRow>
      <TableCell sx={emptyBodyStyle} colSpan={columns.length}>
        <Box sx={contentStyle}>
          {children ||
            (searchKeyword ? (
              <NoResultsFoundMessage />
            ) : (
              <EmptyGridMessage
                placeholder={placeholder}
                placeholderIcon={placeholderIcon}
              />
            ))}
        </Box>
      </TableCell>
    </TableRow>
  </TableBody>
);

export default PlaceHolder;
