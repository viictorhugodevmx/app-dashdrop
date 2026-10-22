export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'issue';

export type DeliveryPriority =
  | 'standard'
  | 'express';

export type CourierVehicle =
  | 'Bike'
  | 'Motorcycle'
  | 'Car'
  | 'Van';

export type DeliveryFilter =
  | 'all'
  | 'active'
  | 'issues'
  | 'delivered';

export type DeliveryQuery = {
  filter: DeliveryFilter;
  search: string;
};

export type DeliveryStats = {
  total: number;
  active: number;
  delivered: number;
  issues: number;
};

export type DeliveryOverview = {
  deliveries: Delivery[];
  stats: DeliveryStats;
};

export type Courier = {
  id: string;
  name: string;
  vehicle: CourierVehicle;
};

export type DeliveryTimelineEvent = {
  id: string;
  title: string;
  time: string;
  completed: boolean;
};

export type Delivery = {
  id: string;
  orderCode: string;
  customerName: string;
  destination: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  etaMinutes: number;
  distanceKm: number;
  packages: number;
  courier: Courier | null;
  updatedAt: string;
  timeline: DeliveryTimelineEvent[];
};
