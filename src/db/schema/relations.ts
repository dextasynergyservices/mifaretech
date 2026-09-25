import { relations } from "drizzle-orm";
import { user } from "./auth";
import { categories, productDocuments, productImages, productSpecs, products } from "./catalogue";
import { enquiries, enquiryItems, enquiryNotes, enquiryStatusHistory } from "./enquiries";
import { media } from "./media";

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  cover: one(media, { fields: [categories.coverMediaId], references: [media.id] }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  cover: one(media, { fields: [products.coverMediaId], references: [media.id] }),
  images: many(productImages),
  specs: many(productSpecs),
  documents: many(productDocuments),
  enquiryItems: many(enquiryItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
  media: one(media, { fields: [productImages.mediaId], references: [media.id] }),
}));

export const productSpecsRelations = relations(productSpecs, ({ one }) => ({
  product: one(products, { fields: [productSpecs.productId], references: [products.id] }),
}));

export const productDocumentsRelations = relations(productDocuments, ({ one }) => ({
  product: one(products, { fields: [productDocuments.productId], references: [products.id] }),
  media: one(media, { fields: [productDocuments.mediaId], references: [media.id] }),
}));

export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
  assignee: one(user, { fields: [enquiries.assignedTo], references: [user.id] }),
  items: many(enquiryItems),
  notes: many(enquiryNotes),
  history: many(enquiryStatusHistory),
}));

export const enquiryItemsRelations = relations(enquiryItems, ({ one }) => ({
  enquiry: one(enquiries, { fields: [enquiryItems.enquiryId], references: [enquiries.id] }),
  product: one(products, { fields: [enquiryItems.productId], references: [products.id] }),
}));

export const enquiryNotesRelations = relations(enquiryNotes, ({ one }) => ({
  enquiry: one(enquiries, { fields: [enquiryNotes.enquiryId], references: [enquiries.id] }),
  author: one(user, { fields: [enquiryNotes.authorId], references: [user.id] }),
}));

export const enquiryStatusHistoryRelations = relations(enquiryStatusHistory, ({ one }) => ({
  enquiry: one(enquiries, {
    fields: [enquiryStatusHistory.enquiryId],
    references: [enquiries.id],
  }),
  actor: one(user, { fields: [enquiryStatusHistory.changedBy], references: [user.id] }),
}));
