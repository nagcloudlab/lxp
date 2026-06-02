"use client";

import {
  getDeliveryStorageKey,
  type Cohort,
  type Enrollment,
  type ProgressEvent,
  type QuizAttempt,
  type SMEAlert
} from "@/lib/training-projects";

export type DeliveryState = {
  cohorts: Cohort[];
  enrollments: Enrollment[];
  progressEvents: ProgressEvent[];
  quizAttempts: QuizAttempt[];
  smeAlerts: SMEAlert[];
};

const emptyDeliveryState: DeliveryState = {
  cohorts: [],
  enrollments: [],
  progressEvents: [],
  quizAttempts: [],
  smeAlerts: []
};

export function loadDeliveryState(projectId: string): DeliveryState {
  if (typeof window === "undefined") {
    return emptyDeliveryState;
  }

  const raw = window.localStorage.getItem(getDeliveryStorageKey(projectId));

  if (!raw) {
    return emptyDeliveryState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DeliveryState>;
    return {
      cohorts: Array.isArray(parsed.cohorts) ? parsed.cohorts : [],
      enrollments: Array.isArray(parsed.enrollments) ? parsed.enrollments : [],
      progressEvents: Array.isArray(parsed.progressEvents)
        ? parsed.progressEvents
        : [],
      quizAttempts: Array.isArray(parsed.quizAttempts)
        ? parsed.quizAttempts
        : [],
      smeAlerts: Array.isArray(parsed.smeAlerts) ? parsed.smeAlerts : []
    };
  } catch {
    return emptyDeliveryState;
  }
}

export function saveDeliveryState(projectId: string, state: DeliveryState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getDeliveryStorageKey(projectId), JSON.stringify(state));
}

