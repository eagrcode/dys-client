import React from "react";

if (__DEV__) {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHookChanges: true,
    // logOnDifferentValues: true, // optional, noisier
  });
}
