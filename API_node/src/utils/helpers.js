/**
 * Busca um recurso por ID e retorna 404 automaticamente se não encontrado.
 */
async function findByIdOr404(Model, id, res, resourceName = 'Resource') {
  try {
    const resource = await Model.findByPk(id);

    if (!resource) {
      res.status(404).json({ mensagem: `${resourceName} not found.` });
      return null;
    }

    return resource;
  } catch (error) {
    res.status(500).json({ erro: 'Erro when searching for resource.' });
    return null;
  }
}

export { findByIdOr404 };