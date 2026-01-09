import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CheckIcon from "@mui/icons-material/Check";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useTranslation } from 'react-i18next';
export interface PopupContentProps {
  properties: any;
  goToDetailEdit: () => void;
  goToSurvey: () => void;
  goToEditRouteEvidence: () => void;
}

const PopupContent: React.FC<PopupContentProps> = ({ properties, goToDetailEdit, goToSurvey, goToEditRouteEvidence }) => {

  const { t } = useTranslation();

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2
    }}>
      <Typography variant="h6">{t('domain_map_popup_content_properties')}:</Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        paddingX: 2
      }}>
        {Object.entries(properties).map(([key, value]) => (
          <li key={key}><b>{key}:</b> {String(value)}</li>
        ))}
      </Box>

      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Button onClick={() => goToDetailEdit()} variant="outlined" sx={{
        }}>
          {properties.bitacoraActividades.includes("VISITADA") && (
            <CheckIcon
              sx={{
                fontSize: 15,
                position: "absolute",
                color: "green",
                top: 0,
                left: 0,
                textShadow: "0 0 1px green, 0 0 1px green",
              }}
            />
          )}
          <ModeEditIcon />
        </Button>
        <Button onClick={() => goToEditRouteEvidence()} variant="outlined" sx={{
        }}>
          {properties.bitacoraActividades.includes("EVIDENCIA") && (
            <CheckIcon
              sx={{
                fontSize: 15,
                position: "absolute",
                color: "green",
                top: 0,
                left: 0,
                textShadow: "0 0 1px green, 0 0 1px green",
              }}
            />
          )}
          <AddAPhotoIcon />
        </Button>
        <Button onClick={() => goToSurvey()} variant="outlined" sx={{
        }}>
          {properties.bitacoraActividades.includes("ENCUESTA") && (
            <CheckIcon
              sx={{
                fontSize: 15,
                position: "absolute",
                color: "green",
                top: 0,
                left: 0,
                textShadow: "0 0 1px green, 0 0 1px green",
              }}
            />
          )}
          <QuestionAnswerIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default PopupContent;
