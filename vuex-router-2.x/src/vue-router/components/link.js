/* eslint-disable */
export default {
  name: "RouterLink",
  functional: true,
  props: {
    to: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
    },
  },
  render(h, context) {
    let tag = context.tag || "a";
    const handler = () => {
      context.$parent.$router.push(context.props.to);
    };
    return h(
      tag,
      {
        on: {
          click: handler,
        },
      },
      context.slots().default
    );
  },
};
