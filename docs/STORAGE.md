# Supabase Storage Configuration — Serenova

This document outlines the required configuration for the Supabase Storage bucket hosting client payment proofs.

## Bucket Details
- **Bucket ID**: `payment-proofs`
- **Public Access**: **Disabled (Private)**
- **Max File Size**: `5242880` bytes (5 MB)
- **Allowed MIME Types**: `['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']`

---

## Storage Row Level Security (RLS) Policies

To protect sensitive client payment information, the following RLS policies must be applied to the `storage.objects` table:

### 1. SELECT — Client Access
- **Policy Name**: `Allow clients to read their own payment proofs`
- **Definition**: Clients can read files matching their UUID within the storage path structure.
- **SQL Condition**:
  ```sql
  (bucket_id = 'payment-proofs'::text) AND 
  (auth.uid()::text = (storage.foldername(name))[1])
  ```

### 2. SELECT — Therapist Access
- **Policy Name**: `Allow therapists to view all client payment proofs`
- **Definition**: Therapist/admin can read any file within the bucket.
- **SQL Condition**:
  ```sql
  (bucket_id = 'payment-proofs'::text) AND 
  (public.is_therapist() = true)
  ```

### 3. INSERT — Client Upload
- **Policy Name**: `Allow authenticated clients to upload payment proofs`
- **Definition**: Authenticated client users can insert objects into the bucket where the top-level folder matches their own authenticated user ID.
- **SQL Condition**:
  ```sql
  (bucket_id = 'payment-proofs'::text) AND 
  (auth.uid()::text = (storage.foldername(name))[1]) AND
  (public.is_client() = true)
  ```

### 4. DELETE / UPDATE — Denied
- **Rule**: Clients and therapists are blocked from updating or deleting submitted proof records directly. Any corrections must go through support.
- **SQL Condition**: `false` (No policy granted)
