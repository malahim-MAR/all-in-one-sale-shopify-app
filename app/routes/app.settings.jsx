import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Settings() {
  return (
    <s-page heading="Settings">
      <s-section heading="Setup">
        <s-stack direction="block" gap="base">
          <s-paragraph>
            Features appear on your store only after you turn them on in the
            theme editor under App embeds.
          </s-paragraph>
          <s-unordered-list>
            <s-list-item>
              Announcement bar, marquee, popup, sticky add to cart: turn on
              under App embeds
            </s-list-item>
            <s-list-item>
              Frequently bought together, cart upsells: add as app blocks in
              the product and cart templates
            </s-list-item>
          </s-unordered-list>
          <s-button
            href="shopify:admin/themes/current/editor?context=apps"
            target="_blank"
          >
            Open theme editor
          </s-button>
        </s-stack>
      </s-section>

      <s-section heading="Help & legal">
        <s-stack direction="block" gap="small">
          <s-link href="mailto:sardarmalahim.dev@gmail.com">Contact support</s-link>
          <s-link href="#" target="_blank">Privacy policy</s-link>
          <s-link href="#" target="_blank">Terms of service</s-link>
        </s-stack>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};