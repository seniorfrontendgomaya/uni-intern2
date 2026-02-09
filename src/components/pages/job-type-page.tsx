"use client";

import { useJobTypesPaginated } from "@/hooks/useJobType";
import { CompanyClient } from "@/app/(dashboard)/company/job-type/company-client";
import { useState } from "react";

export function JobTypePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    items,
    page,
    setPage,
    perPage,
    count,
    hasNext,
    hasPrev,
    loading,
    refresh,
  } = useJobTypesPaginated(10, searchTerm);

  return (
    <CompanyClient
      data={items}
      loading={loading || false}
      page={page}
      perPage={perPage}
      count={count}
      hasNext={hasNext}
      hasPrev={hasPrev}
      onNext={() => setPage((current) => current + 1)}
      onPrev={() => setPage((current) => Math.max(1, current - 1))}
      onPageSelect={(value) => setPage(value)}
      onRefresh={refresh}
      searchProps={{
        value: searchTerm,
        onChange: (event) => {
          setSearchTerm(event.target.value);
          setPage(1);
        },
      }}
    />
  );
}
