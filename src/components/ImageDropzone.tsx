import React, { useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Grid, Typography } from "@material-ui/core";
import CloudUpload from "@material-ui/icons/CloudUpload";

interface Props {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File>>;
}

export default function ImageDropzone({ file, setFile }: Props) {
  const inputRef = useRef(null);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  return (
    <>
      {!file ? (
        <section
          className="container"
          style={{
            borderStyle: "dashed",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.5)",
            minHeight: 128,
            cursor: "pointer",
          }}
          onClick={() => inputRef.current.click()}
        >
          <div
            {...getRootProps({ className: "dropzone" })}
            style={{ padding: 16 }}
          >
            <input {...getInputProps()} ref={inputRef} />
            <Typography variant="body1" style={{ textAlign: "center" }}>
              Drag and drop the image you want to upload for your post.
            </Typography>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CloudUpload />
            </div>
          </div>
        </section>
      ) : (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
          spacing={1}
        >
          <Grid item>
            <Typography variant="h6">Your Image:</Typography>
          </Grid>
          <Grid item>
            <img
              src={URL.createObjectURL(file)}
              style={{ width: "auto", maxHeight: 320 }}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
