import { HubShell } from "@/components/hub-shell";
import { referralTree } from "@fosl/mocks";
import type { ReferralNode } from "@fosl/mocks";

function TreeNode({ node, depth = 0 }: { node: ReferralNode; depth?: number }) {
  return (
    <li className="mt-2">
      <div
        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        style={{ marginLeft: depth * 24 }}
      >
        <span className="font-medium">{node.label}</span>
        {node.level === 2 && (
          <span className="ml-2 rounded bg-slate-100 px-1.5 text-xs text-slate-500">L2</span>
        )}
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="border-l border-slate-200 pl-4">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ReferralTreePage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Referral tree</h1>
          <p className="text-slate-600">Two-level hierarchy · pseudonymous nodes · GDPR-safe</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <ul>
            <TreeNode node={referralTree} />
          </ul>
        </div>
        <p className="text-sm text-slate-500">
          Second-level referrals earn reduced commission per operator rules. Tree respects user
          consent settings.
        </p>
      </div>
    </HubShell>
  );
}
