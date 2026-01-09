import styled from 'styled-components';

const SkeletonLine = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;

  body.dark-theme & {
    background: linear-gradient(90deg, #3d3d3d 25%, #4d4d4d 50%, #3d3d3d 75%);
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export function TableSkeleton({ rows = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <SkeletonLine style={{ width: '100%' }} />
          <SkeletonLine style={{ width: '80%' }} />
        </div>
      ))}
    </div>
  );
}
