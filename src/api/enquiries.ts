import { get } from "./client";

export type Enquiry = {
    id: string;
    userId?: string;
    fromName?: string | null;
    subject?: string | null;
    status?: string | null;
    messages?: Array<{
        id?: string;
        from?: string;
        fromName?: string | null;
        message?: string;
        date?: string;
    }>;
    createdAt?: string | null;
    updatedAt?: string | null;
};

export type EnquiryList = {
    items: Enquiry[];
    meta?: { total?: number; page?: number; limit?: number };
};

export async function listEnquiries(params?: Record<string, any>): Promise<EnquiryList> {
    const res = await get<any>("/enquiries", params);

    if (res && typeof res === "object") {
        if (Array.isArray(res)) return { items: res as Enquiry[] };
        if (Array.isArray(res.items)) {
            return { items: res.items as Enquiry[], meta: res.meta };
        }
        if (res.data && Array.isArray(res.data.items)) {
            return { items: res.data.items as Enquiry[], meta: res.data.meta };
        }
    }

    return { items: [] };
}
