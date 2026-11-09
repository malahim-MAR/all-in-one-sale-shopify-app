// ALL IMPORTS
import { useEffect } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

// FUNTIONS BELOW

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
        query GetSetting {
            currentAppInstallation {
             id
             metafield(namespace:"$app", key: "settings"){
                value
             }
            }
        }`,
  );
  // RESPONSE END
  const json = await response.json();

  const raw = json.data.currentAppInstallation.metafield?.value;
  const setting = raw
    ? JSON.parse(raw)
    : { announcementText: "", linkText: "", linkUrl: "" };
  return { setting };
};
// LOADER ENDED
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const announcementText = String(
    formData.get("announcementText") ?? "",
  ).trim();
  const linkText = String(formData.get("linkText") ?? "").trim();
  const linkUrl = String(formData.get("linkUrl") ?? "").trim();

  if (announcementText.length > 200) {
    return { ok: false, error: "Text must be 200 characters or less" };
  }
  if (linkText.length > 40) {
    return { ok: false, error: "Link text must be 40 characters or less" };
  }
  // only allow relative paths or https links (blocks javascript: URLs)
  if (linkUrl && !(linkUrl.startsWith("/") || linkUrl.startsWith("https://"))) {
    return { ok: false, error: "Link must start with / or https://" };
  }

  // one query: installation id + current settings
  const currentResponse = await admin.graphql(
    `#graphql
    query GetCurrent {
      currentAppInstallation {
        id
        metafield(namespace: "$app", key: "settings") { value }
      }
    }`,
  );
  const currentJson = await currentResponse.json();
  const ownerId = currentJson.data.currentAppInstallation.id;
  const raw = currentJson.data.currentAppInstallation.metafield?.value;

  let current = {};
  try {
    current = raw ? JSON.parse(raw) : {};
  } catch {
    current = {};
  }

  // merge: keeps any other fields (timer, popup...) you add later
  const merged = { ...current, announcementText, linkText, linkUrl };

  const response = await admin.graphql(
    `#graphql
    mutation SaveSetting($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id value }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        metafields: [
          {
            ownerId,
            namespace: "$app",
            key: "settings",
            type: "json",
            value: JSON.stringify(merged),
          },
        ],
      },
    },
  );
  const json = await response.json();
  const errors = json.data.metafieldsSet.userErrors;
  if (errors.length > 0) {
    return { ok: false, error: errors[0].message };
  }
  return { ok: true };
};

export default function Settings() {
  const { setting } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const shopify = useAppBridge();

  const isSaving = navigation.state === "submitting";
  useEffect(() => {
    if (actionData?.ok) shopify.toast.show("Settings Saved");
  }, [actionData, shopify]);

  return (
    <s-page heading="Settings">
      <Form method="post">
        <s-section heading="Annoucment Bar">
          <s-stack direction="block" gap="base">
            <s-text-field
              name="announcementText"
              label="Annoucment Text"
              defaultValue={setting.announcementText}
            />
            <s-text-field
              name="linkText"
              label="Link text"
              placeholder="Shop now"
              defaultValue={setting.linkText}
            />
            <s-text-field
              name="linkUrl"
              label="Link URL"
              placeholder="/collections/all or https://..."
              defaultValue={setting.linkUrl}
            />
            {actionData?.ok === false && (
              <s-banner tone="critical">{actionData.error}</s-banner>
            )}
            <s-button type="submit" {...(isSaving ? { loading: true } : {})}>
              Save
            </s-button>
          </s-stack>
        </s-section>
      </Form>
    </s-page>
  );
}
