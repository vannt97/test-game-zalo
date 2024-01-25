let urlOrigin = window.location.origin;
let pathName = window.location.pathname;
const params = new URLSearchParams(window.location.search);
let endUrl = urlOrigin + pathName + params.get("version");
const NameGame = "testzalogzip";
const linkGame = "https://game.marvyco.com/inhouse/mini_game/";
const LoaderUrl = linkGame + NameGame + "/Build/Gzip_no_tick.loader.js";
const dataURL = linkGame + NameGame + "/Build/Gzip_no_tick.data.gz";
const frameworkUrl =
  linkGame + NameGame + "/Build/Gzip_no_tick.framework.js.gz";
const codeUrl = linkGame + NameGame + "/Build/Gzip_no_tick.wasm.gz";
const streamingAssetsUrl = linkGame + NameGame + "/StreamingAssets";
let divWrapper = document.createElement("div");
divWrapper.style.height = "100%";
divWrapper.innerHTML = `<div id="loader">
<input type="file" id="avatar" hidden />
<div id="logo">
  <img src="${endUrl}/load-logo.png" alt="logo" />
</div>
<div id="thumbnail_game">
  <img src="${endUrl}/load-bottom.png" alt="thumbnail_game" />
</div>
<div id="progress">
  <div id="full"></div>
  <p>Loading</p>
</div>
</div>
<canvas
id="unity-canvas"
width="960"
height="600"
style={{
  // "width: 960px; height: 600px; background: #231f20"
  width: 960,
  height: 600,
  background: "#231f20",
}}
></canvas>
<form
onsubmit="FixInputOnSubmit()"
autocomplete="off"
style="width: 0px; height: 0px; position: absolute; top: -9999px"
>
<input
  type="text"
  oninput="FeedUnitty()"
  id="InputTextnative"
  style="width: 200px; height: 0px; position: absolute; top: -9999px"
/>
</form>`;
document.body.appendChild(divWrapper);
var script = document.createElement("script");
script.src = LoaderUrl;
script.onload = () => {
  let load_id = null;
  var uploadButton = document.getElementById("avatar");
  uploadButton.onchange = function (event) {
    window.unityInstance.SendMessage(
      "Canvas",
      "FileSelected",
      URL.createObjectURL(event.target.files[0])
    );
  };

  function uploadImages() {
    uploadButton.click();
  }
  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
  }
  function shareFBImage() {
    FB.init({ appId: `your appid`, status: true, cookie: true });
    FB.ui(
      {
        method: `share`,
        name: "Facebook Dialogs",
        href: $(location).attr("href"),
        link: "https://developers.facebook.com/docs/dialogs/",
        picture: "your image url",
        caption: "Ishelf Book",
        description: "your description",
      },
      function (response) {
        if (response && response.post_id) {
          alert("success");
        } else {
          alert("error");
        }
      }
    );
  }
  console.log(
    `document.querySelector("#unity-canvas"): `,
    document.querySelector("#unity-canvas")
  );
  createUnityInstance(
    document.querySelector("#unity-canvas"),
    {
      dataUrl: dataURL,
      frameworkUrl,
      codeUrl,
      streamingAssetsUrl,
      companyName: "marvyco",
      productName: "runtogift",
      productVersion: "1.0",
      matchWebGLToCanvasSize: true, // Uncomment this to separately control WebGL canvas render size and DOM element size.
      devicePixelRatio: 2,
      preserveDrawingBuffer: true, // Uncomment this to override low DPI rendering on high DPI displays.
    },
    (progress) => {
      console.log(100 * progress + "%");
      document.getElementById("full").style.transform = `scaleX(${
        progress * 0.8
      })`;
    }
  ).then((unityInstance) => {
    window.unityInstance = unityInstance;
    var pro = 0.8;
    clearInterval(load_id);
    load_id = setInterval(() => {
      if (pro < 1.0) {
        pro += 0.001;
        document.getElementById("full").style.transform = `scaleX(${pro})`;
      } else {
        document.getElementById("loader").style.display = "none";
        clearInterval(load_id);
      }
    }, 2);
  });

  var unityCanvas = document.getElementById("unity-canvas");
  var loaderContainer = document.getElementById("loader");

  function scale() {
    // var factorCanvas = window.innerHeight / window.innerWidth;
    // if (factorCanvas < 16 / 9) {
    //   console.log("Under" + factorCanvas);
    //   unityCanvas.style.width = window.innerHeight * (9 / 16) + "px";
    //   unityCanvas.style.height = window.innerHeight + "px";

    //   loaderContainer.style.width = window.innerHeight * (9 / 16) + "px";
    //   loaderContainer.style.height = window.innerHeight + "px";
    // } else {
    //   console.log("Above" + factorCanvas);
    //   unityCanvas.style.width = window.innerWidth + "px";
    //   unityCanvas.style.height = window.innerWidth * (16 / 9) + "px";
    //   loaderContainer.style.width = window.innerWidth + "px";
    //   loaderContainer.style.height = window.innerWidth * (16 / 9) + "px";
    // }

    unityCanvas.style.width = window.innerWidth + "px";
    unityCanvas.style.height = window.innerHeight + "px";

    loaderContainer.style.width = window.innerWidth + "px";
    loaderContainer.style.height = window.innerHeight + "px";
  }
  scale();
  window.addEventListener("resize", resizeWindow);
  function resizeWindow() {
    scale();
  }
  function ReloadConfiguration() {
    window.unityInstance.SendMessage(
      "GameManager",
      "OnNativeCallsUpdateConfiguration"
    );
  }

  var unityObjectname = "";
  function SetObjectName(objectName) {
    unityObjectname = objectName;
  }
  function FixInputOnSubmit() {
    console.log("Sunmit completed");
    document.getElementById("InputTextnative").blur();
    event.preventDefault();
    window.unityInstance.SendMessage(unityObjectname, "ClearCurrentInput");
  }
  function DeselectNative() {
    console.log("deselect native input from unity");
    document.getElementById("InputTextnative").blur();
    window.unityInstance.SendMessage(unityObjectname, "ClearCurrentInput");
  }
  function FeedUnitty() {
    var hInput = document.getElementById("InputTextnative");
    console.log(hInput.value);
    window.unityInstance.SendMessage(
      unityObjectname,
      "SetInputString",
      hInput.value
    );
    window.unityInstance.SendMessage(
      unityObjectname,
      "SetCaretPos",
      hInput.selectionStart
    );
  }
  function SelectInput(stringDefault, caretPosStart, caretPosEnd) {
    var hInput = document.getElementById("InputTextnative");
    hInput.value = stringDefault;
    hInput.setSelectionRange(caretPosStart, caretPosEnd);
    hInput.focus();
  }

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var origin = urlParams.get("origin");
  if (origin != null) {
    window.addEventListener("message", (event) => {
      // IMPORTANT: check the origin of the data!
      if (event.origin.startsWith(origin)) {
        // The data was sent from your site.
        // Data sent with postMessage is stored in event.data:
        console.log(event.data);
        ReloadConfiguration();
      } else {
        // The data was NOT sent from your site!
        // Be careful! Do not use it. This else branch is
        // here just for clarity, you usually shouldn't need it.
        return;
      }
    });
  }
};

document.body.appendChild(script);
