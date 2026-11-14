import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

const features = [
  {
    name: "Announcement bar",
    description:
      "Show a sale message with a link at the top of your store, with a countdown timer.",
    status: "Live",
    href: "/app/announcement-bar",
  },
  {
    name: "Sale marquee",
    description: "A scrolling strip of sale messages to catch attention.",
    status: "Coming soon",
  },
  {
    name: "Sale popup",
    description:
      "Show a popup with your offer and a discount code customers can copy.",
    status: "Coming soon",
  },
  {
    name: "Sticky add to cart",
    description:
      "Keep an add to cart button at the bottom of product pages as shoppers scroll.",
    status: "Coming soon",
  },
  {
    name: "Frequently bought together",
    description:
      "Suggest related products below the buy buttons so shoppers add more to their order.",
    status: "Coming soon",
  },
  {
    name: "Cart upsells",
    description:
      "Offer related add-ons in the cart drawer and on the cart page.",
    status: "Coming soon",
  },
  {
    name: "Free gifts",
    description: "Give a free product as a gift when a customer buys a chosen product.",
    status: "Coming soon",
  },
];

export default function Index() {
  return (
    <s-page heading="Welcome to all-in-one-sale">
      <s-section heading="Everything you need to run a sale, in one app">
        <s-paragraph>
          Promote your offers and increase order value with sale banners,
          popups, product bundles, upsells, and free gifts. No code needed.
          Set things up here, then turn them on in your theme.
        </s-paragraph>
      </s-section>

      <s-section heading="Features">
        <s-stack direction="block" gap="base">
          {features.map((f) => (
            <s-box
              key={f.name}
              padding="base"
              borderWidth="base"
              borderRadius="base"
            >
              <s-stack direction="inline" gap="base" alignItems="center">
                <s-stack direction="block" gap="small-300">
                  <s-heading>{f.name}</s-heading>
                  <s-text>{f.description}</s-text>
                </s-stack>
                <s-badge tone={f.status === "Live" ? "success" : "neutral"}>
                  {f.status}
                </s-badge>
                {f.href && <s-button href={f.href}>Configure</s-button>}
              </s-stack>
            </s-box>
          ))}
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Get started">
        <s-ordered-list>
          <s-list-item>Open a feature and configure it.</s-list-item>
          <s-list-item>Save your settings.</s-list-item>
          <s-list-item>
            In the theme editor, open App embeds and turn the feature on.
          </s-list-item>
          <s-list-item>Check your storefront.</s-list-item>
        </s-ordered-list>
        <s-link href="/app/settings">Setup &amp; help</s-link>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};