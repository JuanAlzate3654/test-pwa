import type {CSSProperties} from "react";
import * as React from "react";

/**
 * code 404
 *
 * @description component to show when the page is not found
 */
export default function Code404() {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        {/*<img src={image} width="400" alt="404"/>*/}

        <h4 style={styles.title}>Lo sentimos, la página no se encuentra!</h4>

        <p style={styles.description}>
          Lo sentimos, no pudimos encontrar la página que estás buscando.
          ¿Quizás has escrito mal la URL? Asegúrese de revisar su ortografía.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  } as CSSProperties,
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  } as CSSProperties,
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "0px",
    textAlign: "center",
  } as CSSProperties,
  description: {
    textAlign: "center",
    color: "#969696",
  } as CSSProperties,
};
