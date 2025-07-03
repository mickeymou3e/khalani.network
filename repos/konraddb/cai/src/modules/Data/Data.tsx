import { Sidenav } from "@/components/Sidenav";
import FileUpload from "@/icons/FileUpload";
import { Box, Stack, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import Connect from "@/icons/Connect";
import { DataGrid } from "@/components/DataGrid";
import { accountPageStyles, subpageContainerStyles } from "./styled";
import { DataGridWithControls } from "@/components/DataGridWithControls";
import {
  useDeleteFile,
  useListFiles,
  useUploadFiles,
} from "@/hooks/useDataQueries";
import { columnConfig, DataGridColumns } from "./Data.config";
import { mapFileDataToDataGrid } from "./Data.utils";

enum Tabs {
  UPLOAD = "Upload",
  CONNECT = "Connect",
}

export enum GridTabs {
  UNVERIFIED = "Unverified",
  VERIFIED = "Verified",
}

const DataModule = () => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: files } = useListFiles();

  const [selectedTab, setSelectedTab] = useState<string>(Tabs.UPLOAD);
  const content = [
    {
      label: "Upload",
      value: Tabs.UPLOAD,
      icon: <FileUpload fill="#000000" fillOpacity={1} />,
    },
    { label: "Connect", value: Tabs.CONNECT, icon: <Connect /> },
  ];

  const handleTabClick = (value: string) => {
    setSelectedTab(value);
  };

  const [selectedGridTab, setSelectedGridTab] = useState<GridTabs>(
    GridTabs.UNVERIFIED
  );
  const gridTabs = [
    { value: GridTabs.UNVERIFIED, label: "Unverified Data" },
    { value: GridTabs.VERIFIED, label: "Verified data" },
  ];
  const handleTabChange = (_: any, value: string) => {
    setSelectedGridTab(value as GridTabs);
  };

  const handlePageSizeChange = () => {};

  const uploadMutation = useUploadFiles();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate([file], {
        onSuccess: () => {
          console.log("File uploaded successfully");
        },
        onError: (error) => {
          console.error("File upload failed:", error);
        },
      });
    }
  };

  const mappedDataGridArray = useMemo(() => {
    if (!files) return [];
    return files.map(mapFileDataToDataGrid);
  }, [files]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const deleteMutation = useDeleteFile();

  const handleDeleteFile = (fileKey: string) => {
    deleteMutation.mutate(fileKey, {
      onSuccess: () => {
        console.log("File deleted successfully");
      },
      onError: (error) => {
        console.error("File deletion failed:", error);
      },
    });
  };

  const handleCellClicked = (row: any, column: any) => {
    console.log(row.fileKey);
    if (column.key === DataGridColumns.DELETE) {
      handleDeleteFile(row.fileKey);
    }
  };

  return (
    <Stack direction="row" spacing={10} flex={1}>
      <Box sx={accountPageStyles}>
        <Sidenav
          content={content}
          handleClick={handleTabClick}
          selectedTab={selectedTab}
        />
      </Box>

      {selectedTab === Tabs.UPLOAD && (
        <Box sx={subpageContainerStyles}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <DataGridWithControls
            columnConfig={columnConfig}
            dataProvider={mappedDataGridArray}
            gridTabs={gridTabs}
            selectedGridTab={selectedGridTab}
            handleGridTabChange={handleTabChange}
            emptyGridPlaceholder={"Upload a document to get started"}
            emptyGridPlaceholderIcon={
              <FileUpload
                width={72}
                height={72}
                fill={theme.palette.primary.main}
                fillOpacity={0.2}
              />
            }
            listLength={mappedDataGridArray.length}
            onPageSizeChange={handlePageSizeChange}
            buttonText={"Upload"}
            handleButtonClick={handleButtonClick}
            handleCellClicked={handleCellClicked}
            collapseHeader={mappedDataGridArray.length === 0}
            showCsvButton
          />
        </Box>
      )}

      {selectedTab === Tabs.CONNECT && (
        <Box sx={subpageContainerStyles}>
          <DataGrid
            columns={[{ key: "Rem", title: "Rem" }]}
            dataProvider={[]}
            placeholder={"Connect API to get started"}
            placeholderIcon={
              <Connect
                width={72}
                height={72}
                fill={theme.palette.primary.main}
                fillOpacity={0.2}
              />
            }
            collapseHeader
          />
        </Box>
      )}
    </Stack>
  );
};

export default DataModule;
