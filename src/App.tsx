import "./styles.css";
import { Excalidraw, exportToCanvas } from "@excalidraw/excalidraw";
import { useState } from "react";

export default function App() {
  const [outputUrl, setOutputUrl] = useState("");
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  const onGenerate = async () => {
    if (!excalidrawAPI) {
      return;
    }
    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) {
      return;
    }
    const canvas = await exportToCanvas({
      elements,
      appState: {
        exportWithDarkMode: false
      },
      files: excalidrawAPI.getFiles(),
      getDimensions: () => {
        return { width: 350, height: 350 };
      }
    });
    const dataURL = canvas.toDataURL();
    // const body = {
    //   version:
    //     "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
    //   input: {
    //     image: dataURL,
    //     prompt: "A hot air balloon in sunset in Turkey"
    //   }
    // };
    // try {
    //   const response = await fetch("https://api.replicate.com/v1/predictions", {
    //     method: "POST",
    //     body: JSON.stringify(body),
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Token ef4dd9828194f416a9c98e38cfdde3a5ea83ee10"
    //     }
    //   });
    //   const responseJSON = await response.json();
    //   console.log(responseJSON);
    // } catch (e) {
    //   console.error(e);
    // }

    const Replicate = window.Replicate;
    const replicate = new Replicate({
      proxyUrl: "https://630e-64-137-159-133.ngrok.io"
    });

    const helloWorldModel = await replicate.models.get("replicate/hello-world");
    const helloWorldPrediction = await helloWorldModel.predict({
      text: "test"
    });
    console.log(helloWorldPrediction);
  };

  return (
    <>
      <div style={{ height: "400px" }}>
        <Excalidraw ref={(api) => setExcalidrawAPI(api)} />
      </div>
      <button onClick={onGenerate}>Generate</button>
      <img src={outputUrl} alt="" />
    </>
  );
}
