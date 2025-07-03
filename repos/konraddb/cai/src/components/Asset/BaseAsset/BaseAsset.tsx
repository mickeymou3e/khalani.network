import Image from "next/image";

import { Box, Typography } from "@mui/material";

import {
  StyledContainer,
  StyledIconContainer,
  StyledTextContainer,
} from "./BaseAsset.styles";
import { BaseAssetProps } from "./types";

const SEPARATOR = "/";

export const BaseAsset = ({
  assets,
  iconSize = 24,
  label,
  description,
  showDescription = false,
  LabelProps,
  DescriptionProps,
  showLabel = true,
  small = false,
  ...rest
}: BaseAssetProps) => {
  if (![1, 2].includes(assets.length)) {
    throw new Error("Assets array can include either 1 or 2 assets");
  }

  const iconsPresent = assets.some((asset) => Boolean(asset.icon));
  const assetLabelCreator = (prop: "label" | "description") =>
    assets
      .filter((asset) => Boolean(asset[prop]))
      .map((asset) => asset[prop])
      .join(SEPARATOR);
  const assetLabel = assetLabelCreator("label");
  const assetDescription = assetLabelCreator("description");
  const [firstAsset] = assets;

  // TODO: Review why we have height applied to Typography
  return (
    <StyledContainer {...rest}>
      {iconsPresent && (
        <Box display="flex" alignItems="center">
          <StyledIconContainer iconSize={iconSize} aria-label="Base Asset Icon">
            {firstAsset.icon && (
              <Image
                src={firstAsset.icon.toLowerCase()}
                alt={firstAsset.label || ""}
                width={iconSize}
                height={iconSize}
              />
            )}
          </StyledIconContainer>
        </Box>
      )}
      {showLabel && (
        <StyledTextContainer>
          <Typography
            height={iconSize}
            variant={small ? "body2" : "body1"}
            color="primary.main"
            {...LabelProps}
          >
            {label || assetLabel}
          </Typography>
          {(showDescription || description) && (
            <Typography
              variant="buttonSmall"
              color="primary.gray2"
              {...DescriptionProps}
            >
              {description || assetDescription}
            </Typography>
          )}
        </StyledTextContainer>
      )}
    </StyledContainer>
  );
};
