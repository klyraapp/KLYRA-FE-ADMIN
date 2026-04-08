import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./IconUpload.module.css";

const IconUpload = ({ value, onChange, disabled }) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState(null);
  const bucketUrl = process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_URL || process.env.AWS_PUBLIC_BUCKET_URL ;

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
      
        const url = value.startsWith("http") ? value : `${bucketUrl}/${value}`;
        setPreviewUrl(url);
      } else if (value instanceof File || (value?.originFileObj instanceof File)) {
       
        const file = value instanceof File ? value : value.originFileObj;
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [value, bucketUrl]);

  const handleChange = (info) => {
    const { file } = info;
    // We want to pass the actual file object to the form
    if (onChange) {
      onChange(file.originFileObj || file);
    }
  };

  const beforeUpload = (file) => {
    // Prevent default upload behavior (we handle it via Form/API)
    return false;
  };

  return (
    <div className={styles.iconUploadContainer}>
      <div className={styles.previewContainer}>
        {previewUrl ? (
          <img src={previewUrl} alt="Icon Preview" className={styles.previewImage} />
        ) : (
          <div className={styles.placeholder}>{t("fields.noIcon")}</div>
        )}
      </div>
      {!disabled && (
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>
            {previewUrl ? t("fields.changeIcon") : t("fields.uploadIcon")}
          </Button>
        </Upload>
      )}
    </div>
  );
};

IconUpload.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default IconUpload;
