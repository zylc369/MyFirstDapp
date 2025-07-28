const Utils = {
  getAnyTypeString(e) {
    if (e === null || e === undefined) {
      return e;
    }
    if (typeof e === "object") {
      const seen = new WeakSet();
      return JSON.stringify(
        e,
        (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
          }
          return value;
        },
        2
      ); // 缩进2格美化输出
    }

    return `${e}`;
  },
};

export default Utils;
