import React from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DashboardWorkList } from './DashboardWorkList';
import * as useGraphQLModule from '@/hooks/useGraphQL';

vi.mock('@/hooks/useGraphQL');

describe('DashboardWorkList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state', async () => {
    vi.spyOn(useGraphQLModule, 'useGraphQLQuery').mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    } as any);

    render(<DashboardWorkList />);

    await waitFor(() => {
      expect(screen.getByText('loading')).toBeInTheDocument();
    });
  });

  it('renders error state', async () => {
    vi.spyOn(useGraphQLModule, 'useGraphQLQuery').mockReturnValue({
      isLoading: false,
      error: new Error('Test error'),
      data: null,
    } as any);

    render(<DashboardWorkList />);

    await waitFor(() => {
      expect(screen.getByText('error')).toBeInTheDocument();
    });
  });

  it('renders not found state', async () => {
    vi.spyOn(useGraphQLModule, 'useGraphQLQuery').mockReturnValue({
      isLoading: false,
      error: null,
      data: {},
    } as any);

    render(<DashboardWorkList />);

    await waitFor(() => {
      expect(screen.getByText('not found')).toBeInTheDocument();
    });
  });

  it('renders work list', async () => {
    const mockWorks = [
      {
        id_work: '1',
        name: 'Test Work',
        created_at: '2023-01-01T10:00:00Z',
        level: 50,
        repository_name: 'test-repo',
        id_repository: 'repo1',
        document: {
          feature: {
            name: 'Test Feature'
          },
          has_code_dump: true
        }
      }
    ];

    vi.spyOn(useGraphQLModule, 'useGraphQLQuery').mockReturnValue({
      isLoading: false,
      error: null,
      data: { output: mockWorks },
    } as any);

    render(<DashboardWorkList />);

    await waitFor(() => {
      expect(screen.getByText('Test Work')).toBeInTheDocument();
      expect(screen.getByText('01/01/2023')).toBeInTheDocument();
      expect(screen.getByText('Test Feature')).toBeInTheDocument();
      expect(screen.getByText('50.00%')).toBeInTheDocument();
      expect(screen.getByText('test-repo')).toBeInTheDocument();
      expect(screen.getByText('repo1')).toBeInTheDocument();
      expect(screen.getByText('processed')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders work list with missing optional fields', async () => {
    const mockWorks = [
      {
        id_work: '1',
        name: 'Test Work',
        created_at: '2023-01-01T10:00:00Z',
        level: 50,
        repository_name: 'test-repo',
        id_repository: 'repo1',
        document: {}
      }
    ];

    vi.spyOn(useGraphQLModule, 'useGraphQLQuery').mockReturnValue({
      data: { output: mockWorks },
      isLoading: false,
      error: null
    });

    render(<DashboardWorkList />);

    expect(await screen.findByText('Test Work')).toBeInTheDocument();
    expect(await screen.findByText('01/01/2023')).toBeInTheDocument();
    expect(await screen.findByText('50.00%')).toBeInTheDocument();
    expect(await screen.findByText('test-repo')).toBeInTheDocument();
    expect(await screen.findByText('repo1')).toBeInTheDocument();
    expect(await screen.findByText('not-processed')).toBeInTheDocument();
    expect(screen.queryByText('Test Feature')).not.toBeInTheDocument();
  });

  it('renders work list with missing feature name', async () => {
    const mockWorks = [
      {
        id_work: '1',
        name: 'Test Work',
        created_at: '2023-01-01T10:00:00Z',
        level: 50,
        repository_name: 'test-repo',
        id_repository: 'repo1',
        document: {
          has_code_dump: true
        }
      }
    ];

    vi.spyOn(useGraphQLModule, 'useGraphQLQuery').mockReturnValue({
      data: { output: mockWorks },
      isLoading: false,
      error: null
    });

    render(<DashboardWorkList />);

    expect(await screen.findByText('Test Work')).toBeInTheDocument();
    expect(await screen.findByText('01/01/2023')).toBeInTheDocument();
    expect(await screen.findByText('50.00%')).toBeInTheDocument();
    expect(await screen.findByText('test-repo')).toBeInTheDocument();
    expect(await screen.findByText('repo1')).toBeInTheDocument();
    expect(await screen.findByText('processed')).toBeInTheDocument();
    expect(screen.queryByText('Test Feature')).not.toBeInTheDocument();
  });
});