"use client";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { logger } from "@/lib/logger";
import { cardHeading } from "@/utils/fonts";
import { ServiceFormType } from "@/validation/providerDashboard/serviceSchema";

import MyServiceCard from "./myServiceCard";

const ServiceModal = dynamic(() => import("./serviceModal"), { ssr: false });

const initialData: ServiceFormType[] = [
  {
    title: "Electrical installation",
    startingPrice: 200,
    city: "Casablanca",
    category: "Electrical",
    description: "Electrical services",
    status: true,
    images: [],
  },
  {
    title: "Plumbing work",
    startingPrice: 150,
    city: "Casablanca",
    category: "Plumbing",
    description: "Plumbing services",
    status: true,
    images: [],
  },
];

export default function MyServices() {
  const [services, setServices] = useState(initialData);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const t = useTranslations("providersDashboard.myServices");

  const handleSaveService = (service: ServiceFormType) => {
    if (editingServiceIndex !== null && editingServiceIndex >= 0) {
      const updated = [...services];
      updated[editingServiceIndex] = {
        ...updated[editingServiceIndex],
        ...service,
      };
      setServices(updated);
      logger.info(services);
    } else {
      // Provide default bg and icon for new service
      const newService: ServiceFormType = {
        ...service,
      };
      setServices([...services, newService]);
    }
    setEditingServiceIndex(null);
  };

  const handleDeleteService = (index: number) => {
    const updated = services.filter((_, idx) => idx !== index);
    setServices(updated);
  };

  return (
    <>
      <section className="my-8 px-5 md:my-16">
        <div className="container  space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`${cardHeading} text-heading`}>{t("title")} </h2>
            <button
              onClick={() => setEditingServiceIndex(-1)} // new service
              className="bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-[40px] min-w-[40px] cursor-pointer items-center justify-center gap-2 rounded-xl p-5 text-white shadow-md shadow-black/10 duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
              aria-label="Add new service"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:block">{t("addNewService")} </span>
            </button>
          </div>

          <div className="space-y-4">
            {services.map((item, idx) => (
              <MyServiceCard
                key={idx}
                title={item.title}
                category={item.category}
                price={item.startingPrice}
                location={item.city}
                active={item.status}
                onEdit={() => setEditingServiceIndex(idx)}
                onDelete={() => handleDeleteService(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {editingServiceIndex !== null && (
        <ServiceModal
          defaultValues={editingServiceIndex >= 0 ? services[editingServiceIndex] : undefined}
          onClose={() => setEditingServiceIndex(null)}
          onSave={handleSaveService}
        />
      )}
    </>
  );
}
