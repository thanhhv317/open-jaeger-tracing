const assert = require("assert");

const { initTracer } = require("../../lib/tracing")

const tracer = initTracer("hello-world");

const sayHello = helloTo => {
  const span = tracer.startSpan("say-hello");
  const ctx = {span};
  console.log(ctx);
  span.setTag("hello-to", helloTo)
  const helloStr = formatString(ctx, helloTo);
  printHello(ctx, helloStr);

  span.finish();
}

const formatString = (ctx, helloTo) => {
  ctx = {
    span: tracer.startSpan("formatString", { childOf: ctx.span})
  };
  // const span = tracer.startSpan("formatString", { childOf: rootSpan });
  const helloStr = `Hello, ${helloTo}!`;
  ctx.span.log({
    event: "string-format",
    value: helloStr
  });
  ctx.span.finish();
  return helloStr;
}

const printHello = (ctx, helloStr) => {
  ctx = {
    span: tracer.startSpan("PrintHello", {childOf: ctx.span})
  };
  // const span = tracer.startSpan("printHello", { childOf: rootSpan });
  console.log(helloStr);
  ctx.span.log({ event: "print-string" })
  ctx.span.finish();
}


assert(process.argv.length == 3, "Expectiong one argument");
const helloTo = process.argv[2];
sayHello(helloTo);

tracer.close(() => process.exit());