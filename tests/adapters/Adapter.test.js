// FILEPATH: /d:/Projects/pmp-backend/tests/adapters/Adapter.test.js
const { AdapterFactory } = require("../../src/factories/AdapterFactory");
const Project = require("../../src/models/Project");

jest.mock("../../src/models/Project", () => ({
  findByPk: jest.fn(),
}));

describe("Adapter", () => {
  describe("getAllProjectData", () => {
    it("should return project data", async () => {
      const projectId = 203;
      const mockProjectData = {
        id: projectId,
        name: "Test Project",
      };

      Project.findByPk.mockResolvedValue(mockProjectData);

      const adapter = AdapterFactory.createAdapter(1);
      const result = await adapter.getAllProjectData(projectId);

      expect(result).toEqual(mockProjectData);
      expect(Project.findByPk).toHaveBeenCalledWith(
        projectId,
        expect.any(Object)
      );
    });
  });
});
